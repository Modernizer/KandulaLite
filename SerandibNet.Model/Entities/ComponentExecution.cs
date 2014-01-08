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
    public class ComponentExecution: IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime date { get; set; }
        public int TotalUnitTestRun { get; set; }
        public int TestRunPerDay { get; set; }

        public int ComponentId { get; set; }
        public virtual Component Component { get; set; }
    }
}
