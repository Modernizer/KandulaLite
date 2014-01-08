using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace SerandibNet.SPA.html5.ServersideCode
{
    /// <summary>
    /// Summary description for AppLookup
    /// </summary>
    public class AppLookup : IHttpHandler
    {
        string appsPath;
        public void ProcessRequest(HttpContext context)
        {
            string appmatch = context.Request.QueryString["appmatch"];
            appsPath = context.Server.MapPath("/html5/app/apps"); ;
           
            /////
            context.Response.Expires = -1;

            context.Response.ContentEncoding = Encoding.GetEncoding("ISO-8859-1");
            context.Response.Charset = "ISO-8859-1";
            context.Response.CacheControl = "no-cache";
            context.Response.ContentType = "application/json";


            if (appmatch == "welcome")
            {
                CommandResult result = new CommandResult("HomeApp", "dashboardAdmin");
               
                result.UserName = context.User.Identity.Name;
                string json = JsonConvert.SerializeObject(result);
                context.Response.Write(json);
            }
            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}