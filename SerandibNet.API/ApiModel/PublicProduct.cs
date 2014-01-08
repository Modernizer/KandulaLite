using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SarandibNet.API.ApiModel
{
    public class PublicProduct: IIdentifier
    {
        public int Id { get; set; }

        public Guid GUID { get; set; }

        public byte[] RowVersion { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public List<ProductDetail> Details { get; set; }
    }

    public class ProductDetail {
        public string Title { get; set; }
    }
}