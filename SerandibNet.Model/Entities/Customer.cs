using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SarandibNet.Model.Entities
{
    public class Customer : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }

        public String  CustomerName { get; set; }
        public String  Address { get; set; }
        public String  PhoneNo { get; set; }
        public String Email { get; set; }
        
    }
}
