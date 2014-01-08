using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SerandibNet.Model.Entities
{
    public class AppUser : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }

        public String UserName { get; set; }

        public String UserType { get; set; }
    }
}
