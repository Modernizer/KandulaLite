using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SarandibNet.Data.Core;

namespace SerandibNet.Model.Entities
{
    public class ProductExecution : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime date { get; set; }
        public int TotalDeploymentTestRun { get; set; }
        public int TestRunPerDay { get; set; }

        public int ProductId { get; set; }
        public virtual SoftwareProduct Product { get; set; }
    }
}
