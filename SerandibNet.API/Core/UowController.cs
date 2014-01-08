using SarandibNet.Data;
using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.OData;

namespace SarandibNet.API.Core
{
    public class UowController<ApiType> : EntitySetController<ApiType, int> where ApiType : class, IIdentifier
    {
        protected IUnitOfWork UnitOfWork { get; set; }

        static UowController()
        {
            UowFactory.Configure(false, true);
        }

        public UowController()
        {
            UnitOfWork = UowFactory.CreateUnitOfWork("DefaultConnection");
        }

        protected override void Dispose(bool disposing)
        {
            UnitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}