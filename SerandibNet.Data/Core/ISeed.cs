using SarandibNet.Data.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SarandibNet.Data.Core
{
    interface ISeed
    {
        void Seed(DatabaseContext context);
    }
}
