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
    public class IntigrateTest : IIdentifier
    {

        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime date { get; set; }
        public int manualCoverage { get; set; }
        public int automateCoverage { get; set; }
      //  [ForeignKey("Story")]
        public int StoryId { get; set; }
        public virtual Feature theStory { get; set; }
    }
}
