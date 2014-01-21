using Newtonsoft.Json;
using SarandibNet.Data;
using SarandibNet.Data.Core;
using SarandibNet.Model;
using SerandibNet.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
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

            RefreshCache(appmatch, appsPath);

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

        private void RefreshCache(string appName, string cachePath)
        {
            Application application = RetrieveApplication(appName);

            if (application != null)
            {
                string appPath = cachePath + "/" + appName;

                if (!Directory.Exists(appPath))
                {
                    Directory.CreateDirectory(appPath);
                }

                RefreshView(application, appPath);

                RefreshViewModel(application, appPath);
            }
        }

        private static Application RetrieveApplication(string appName)
        {
            UnitOfWork uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            IRepository<Application> repository = uow.GetEntityRepository<Application>();
            Application requiredApp = null;

            var apps = from a in repository.GetAll() select a;
            apps = apps.Where(a => a.Name.ToLower().Equals(appName.ToLower()));

            List<Application> applications = apps.ToList();
            if (applications.Count < 1)
            {
                Debug.WriteLine("The app '" + appName + "' doesn't exist in the databse.");
            }
            else if (applications.Count > 1)
            {
                Debug.WriteLine("More than one app '" + appName + "' exists in the databse.");
            }
            else
            {
                requiredApp = applications.ElementAt(0);
            }

            return requiredApp;
        }

        private static void RefreshViewModel(Application application, string appPath)
        {
            string viewModelPath = appPath + "/viewmodels";
            if (!Directory.Exists(viewModelPath))
            {
                Directory.CreateDirectory(viewModelPath);
            }

            List<ApplicationViewModel> applicationViewModels = application.ApplicationViewModels;
            if (applicationViewModels != null)
            {
                foreach (ApplicationViewModel applicationViewModel in applicationViewModels)
                {
                    string viewModelFilePath = viewModelPath + "/" + applicationViewModel.Name;
                    if (!File.Exists(viewModelFilePath) || File.GetLastWriteTime(viewModelFilePath).CompareTo(applicationViewModel.ModifiedTime) < 0)
                    {
                        File.WriteAllBytes(viewModelFilePath, applicationViewModel.Contents);
                    }
                }
            }
        }

        private static void RefreshView(Application application, string appPath)
        {
            string viewPath = appPath + "/views";
            if (!Directory.Exists(viewPath))
            {
                Directory.CreateDirectory(viewPath);
            }

            List<ApplicationView> applicationViews = application.ApplicationViews;
            if (applicationViews != null)
            {
                foreach (ApplicationView applicationView in applicationViews)
                {
                    string viewFilePath = viewPath + "/" + applicationView.Name;
                    if (!File.Exists(viewFilePath) || File.GetLastWriteTime(viewFilePath).CompareTo(applicationView.ModifiedTime) < 0)
                    {
                        File.WriteAllBytes(viewFilePath, applicationView.Contents);
                    }
                }
            }
        }
    }
}