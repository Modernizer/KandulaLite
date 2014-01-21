using SarandibNet.Data.Core;
using SarandibNet.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SerandibNet.Model
{
    public class ApplicationViewModel : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public DateTime ModifiedTime { get; set; }
        public byte[] Contents { get; set; }
        public Application ParentApplication { get; set; }
    }
}
