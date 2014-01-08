using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SarandibNet.Data.Core;
using SarandibNet.Model;

namespace SerandibNet.Model
{
    public class DeploymentTest: IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime date { get; set; }
        public int manualCoverage { get; set; }
        public int automateCoverage { get; set; }
      //  [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public virtual Project theProject { get; set; }
    }
}
