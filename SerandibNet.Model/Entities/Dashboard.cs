﻿using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace SarandibNet.Model
{
    public class Dashboard : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public string Metadata { get; set; }
        public virtual List<Application> AvailableApps { get; set; }

    }
}
