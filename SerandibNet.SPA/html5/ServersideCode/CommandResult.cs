using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SerandibNet.SPA.html5.ServersideCode
{
    public class CommandResult
    {
        public CommandResult(String name, dynamic result)
        {
            this.CommandName = name;
            this.Result = result;
        }

        public String CommandName { get; set; }
        public dynamic Result { get; set; }
        public String UserName { get; set; }
    }
}