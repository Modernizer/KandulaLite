using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SarandibNet.API.Core
{
    public class SimpleCrudController<Type> : CrudController<Type, Type> where Type: class, IIdentifier
    {
        protected override Type ConvertToApiType(Type dbEntity)
        {
            return dbEntity;
        }

        protected override Type ConvertToDbType(Type apiEntity)
        {
            return apiEntity;
        }

        protected override IQueryable<Type> ConvertToApiQueryable(IQueryable<Type> dbQueryable)
        {
            return dbQueryable;
        }
    }
}