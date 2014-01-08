using SarandibNet.API.ApiModel;
using SarandibNet.Model;
using SarandibNet.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.OData.Builder;

namespace SarandibNet.API
{
    public class RestApiModelBuilder : ODataConventionModelBuilder
    {

        public RestApiModelBuilder() 
        {
            EntitySet<PublicProduct>("Products");
            EntitySet<ProductDetail>("ProductDetails");
            EntitySet<Customer>("Customers");
        }
        
    }
}