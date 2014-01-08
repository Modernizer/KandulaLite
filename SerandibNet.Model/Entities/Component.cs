using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SerandibNet.Model.Entities
{
    public class Component: IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public bool Completed { get; set; }

       
        public int FeatureId { get; set; }
        public virtual Feature Feature { get; set; }
   
    }
}
