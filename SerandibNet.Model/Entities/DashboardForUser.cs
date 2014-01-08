using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SarandibNet.Model
{
    public class DashboardForUser : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }



        public String dashboardName { get; set; } 
        public String UserName { get; set; } 
        //[ForeignKey("UserProfile")]
       
    
    }
}