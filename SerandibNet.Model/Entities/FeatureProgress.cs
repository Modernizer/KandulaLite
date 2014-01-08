using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SarandibNet.Data.Core;
using SerandibNet.Model.Entities;

namespace SerandibNet.Model
{
    public class FeatureProgress : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime date { get; set; }
        public int LinesOfCode { get; set; }
        public int IntigrationtestCoverage { get; set; }   //percentage
        public int porgress { get; set; }   //percentage
        //  [ForeignKey("Task")]
        public int FeatureId { get; set; }
        public virtual Feature  Feature { get; set; }
    }
}
