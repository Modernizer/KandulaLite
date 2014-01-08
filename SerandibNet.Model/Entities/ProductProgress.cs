using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SarandibNet.Data.Core;

namespace SerandibNet.Model
{
    public class ProductProgress: IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime date { get; set; }
        public int NumOfFeaturesImplemented { get; set; }
        public int testCoverage { get; set; }   //percentage
        public int porgress { get; set; }   //percentage
       

    }
}
