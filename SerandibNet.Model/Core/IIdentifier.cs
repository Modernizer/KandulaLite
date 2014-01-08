using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SarandibNet.Data.Core
{
    public interface IIdentifier
    {
        int Id { get; set; }

        Guid GUID { get; set; }

        byte[] RowVersion { get; set; }
    }
}
