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
    public class TimeEntry : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }

        public int ProjectId { get; set; }
        public virtual Project project { get; set; }

         public int TaskId { get; set; }
        public virtual Task theTask { get; set; }

        public int EmployeeId { get; set; }
        public virtual Employee employee { get; set; }

        public DateTime date { get; set; }

        public int EffortHrs {get; set;}

    }
}
