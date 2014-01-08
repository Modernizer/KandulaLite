using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SarandibNet.Data.Core;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SarandibNet.Model;

namespace SerandibNet.Model
{
    public class Story : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public bool Completed { get; set; }
       // [ForeignKey("Project")]
        public int SoftwareProductId { get; set; }
        public virtual SoftwareProduct SoftwareProduct { get; set; }
    }
}
