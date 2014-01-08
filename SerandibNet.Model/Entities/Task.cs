using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SarandibNet.Data.Core;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SerandibNet.Model.Entities;
using SarandibNet.Model;

namespace SerandibNet.Model
{
    public class Task : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public bool Completed { get; set; }
     
        public int ComponentId { get; set; }
        public virtual Component theComponents { get; set; }

       
    }
}
