using SarandibNet.Data.Core;
using SarandibNet.Logic.Core.Generic;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.OData;

namespace SarandibNet.API.Core
{
    [ApiExplorerSettings(IgnoreApi = false)]
    public abstract class CrudController<DbType, ApiType> : UowController<ApiType>
        where DbType : class, IIdentifier
        where ApiType : class, IIdentifier
    {
        protected IRepository<DbType> Repository { get; set; }

        public CrudController()
        {
            Repository = UnitOfWork.GetEntityRepository<DbType>();
        }

        protected abstract ApiType ConvertToApiType(DbType dbEntity);

        protected abstract DbType ConvertToDbType(ApiType apiEntity);

        protected abstract IQueryable<ApiType> ConvertToApiQueryable(IQueryable<DbType> dbQueryable);

        public override IQueryable<ApiType> Get()
        {
            IQueryable <DbType> dbEntities = new RetrieveAll<DbType>(UnitOfWork).Execute();
            //return dbEntities.Select(e => new ApiType() { Id });
            return ConvertToApiQueryable(dbEntities);
        }

        protected override ApiType GetEntityByKey([FromODataUri] int key)
        {
           DbType entity = new RetrieveById<DbType>(UnitOfWork).Execute(key);
           if (entity == null)
           {
               throw new HttpResponseException(HttpStatusCode.NotFound);
           }
           return ConvertToApiType(entity);
        }


        protected override int GetKey(ApiType entity)
        {
            if (entity == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            return entity.Id;
        }

        protected override ApiType CreateEntity(ApiType entity)
        {
            if (entity == null)
            {
                var message = "Entity data is not recieved in the request";

                var resp = new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent(message),
                };
                throw new HttpResponseException(resp);
            }

            try
            {
                DbType dbEntity = ConvertToDbType(entity);
                dbEntity = new CreateOrUpdate<DbType>(UnitOfWork).Execute(dbEntity);
                UnitOfWork.Commit();
                return ConvertToApiType(dbEntity);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                var message = "Database concurrency error detected. Entities may have been modified or deleted since entities were loaded. Please reload the entity to obtain the new values.";

                var resp = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent(message),
                    ReasonPhrase = ex.Message,
                };
                throw new HttpResponseException(resp);
            }
        }

        protected override ApiType UpdateEntity(int key, ApiType entity)
        {
            if (key != entity.Id)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            return CreateEntity(entity);

        }

        protected override ApiType PatchEntity(int key, Delta<ApiType> patchEntity)
        {
            ApiType entity = GetEntityByKey(key);
            if (entity == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            patchEntity.Patch(entity);
            UnitOfWork.Commit();
            return entity;
        }

        public override void Delete([FromODataUri] int key)
        {
            DbType entity = new RetrieveById<DbType>(UnitOfWork).Execute(key);

            if (entity == null)
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Entity with ID = {0} not found", key))
                };
                throw new HttpResponseException(resp);
            }

            try
            {
                new Delete<DbType>(UnitOfWork).Execute(entity);
                UnitOfWork.Commit();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                var message = "Database concurrency error detected. Entities may have been modified or deleted since entities were loaded. Please reload the entity to obtain the new values.";
   
                var resp = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent(message),
                    ReasonPhrase = ex.Message,
                };
                throw new HttpResponseException(resp);
            }
        }

    }
}