using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Diagnostics;
using SerandibNet.Model;
using Microsoft.Data.Edm;
using Microsoft.Data.Edm.Validation;
using System.Xml;
using System.Web.Script.Serialization;
using SarandibNet.Data;
using SarandibNet.Data.Core;
using SarandibNet.Model;
using Newtonsoft.Json;

namespace SerandibNet.SPA.Controllers
{

    public class BusinessEntity
    {
        public  String Name { get; set; }
        public List<EntityProperty> PropertyList { get; set; }
        public BusinessEntity(String name, List<EntityProperty> list)
        {
            this.Name = name;
            this.PropertyList = list;
        }
    };


    public class UserApp
    {
        public String AppName { get; set; }
        public String UserName { get; set; }
    }


    public class UserApps
    {
        public List<UserApp> userApps { get; set; }
    }

    public class ToolboxObjectModel
    {
        public String view { get; set; }
        public String viewModel { get; set; }
        public String name { get; set; }

    };

    public class EntityProperty
    {
        public String Name { get; set; }
        public String Type { get; set; }
        public EntityProperty(String name, String type)
        {
            this.Name = name;
            this.Type = type;
        }
    }

    public class ApplicationObject
    {
        public String ApplicationName { get; set; }
    
    }

    public class DashboardController : Controller
    {
        public JsonResult GetApplications()
        {
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<Application>();
            var products = repository.GetAll();


            var query = products.Select(t => new 
                        {
                            Name = t.Name,
                           
                        });

            return Json(query, JsonRequestBehavior.AllowGet);
        }


        static IEdmModel GetEdmModel(string url)
        {
            IEdmModel model = null;
            IEnumerable<EdmError> errors = null;
            using (var reader = XmlTextReader.Create(url))
            {
                if (Microsoft.Data.Edm.Csdl.EdmxReader.TryParse(reader, out model, out errors))
                {
                    return model;
                }
                throw new Exception(errors.First().ErrorMessage);
            }
        }



        private static UnitOfWork Uow { get; set; }

        [HttpPost, ValidateInput(false)]
        public JsonResult SaveModel(ToolboxObjectModel firstLetter)
        {
            String name = Convert.ToString(firstLetter.name);
            String v = Convert.ToString(firstLetter.view);
            String vm = Convert.ToString(firstLetter.viewModel);

            string path = Server.MapPath (@"~\html5\App\apps\");
            path = path + name;
            try
            {
                // Determine whether the directory exists. 
                if (Directory.Exists(path))
                {
                    Debug.WriteLine("That path exists already.");
              }

                // Try to create the directory.
                DirectoryInfo di = Directory.CreateDirectory(path);
                DirectoryInfo di_v = Directory.CreateDirectory(path + "/views");
                DirectoryInfo di_vm = Directory.CreateDirectory(path + "/viewmodels");
                Debug.WriteLine("The directory was created successfully at {0}.", Directory.GetCreationTime(path));

                String viewFileName = name + ".html";
                String viewModelFileName = name + ".js";

                String view_file = path + "\\views\\" + viewFileName;
                String viewmodel_file = path + "\\viewmodels\\" + viewModelFileName;

                if (!System.IO.File.Exists(view_file))
                {
                    System.IO.File.WriteAllText(@view_file, v);
                    System.IO.File.WriteAllText(@viewmodel_file, vm);
                }
                else
                {
                    Console.WriteLine("view File \"{0}\" already exists.", di);

                }


                Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
                var repository = Uow.GetEntityRepository<Application>();
                DateTime appModifiedTime = DateTime.Now;
                Application app = new Application() { GUID = Guid.NewGuid(), Name = name, ModifiedTime = appModifiedTime };
                ApplicationView appView = new ApplicationView() { GUID = Guid.NewGuid(), Name = viewFileName,
                    Contents = System.IO.File.ReadAllBytes(view_file), ModifiedTime = appModifiedTime };
                ApplicationViewModel appViewModel = new ApplicationViewModel() { GUID = Guid.NewGuid(), Name = viewModelFileName,
                    Contents = System.IO.File.ReadAllBytes(viewmodel_file), ModifiedTime = appModifiedTime };

                appView.ParentApplication = app;
                appViewModel.ParentApplication = app;
                app.AddApplicationView(appView);
                app.AddApplicationViewModel(appViewModel);

                var inserted_prod = repository.InsertOrUpdate(app);
                Uow.Commit();
            
                // Delete the directory.
                //di.Delete();
                //Debug.WriteLine("The directory was deleted successfully.");
            }
            catch (Exception e)
            {
                Debug.WriteLine("The process failed: {0}", e.ToString());
            }
            finally { }
           
          
            return Json("Successfull");
        }
  
       

        public JsonResult GetEmployeeJsonData()
        {
            //Get the Odata model of north wind
            IEdmModel model = GetEdmModel(@"http://northwindpoc.azurewebsites.net/odata/$metadata");

            var entityList = new List<BusinessEntity>();

            foreach (IEdmEntityType entityType in model.SchemaElementsAcrossModels().OfType<IEdmEntityType>())
            {
                Console.WriteLine(entityType.FullName());

                var propList = new List<EntityProperty>();
                foreach (IEdmProperty property in entityType.Properties())
                {
                    propList.Add(new EntityProperty(property.Name, property.Type.ToString()));
                    Console.WriteLine("\t" + property.Name);
                }

                var businessEntity = new BusinessEntity(entityType.Name.ToString(), propList);
                entityList.Add(businessEntity);

                
            }

            return Json(entityList, JsonRequestBehavior.AllowGet);
            
        }


         [HttpPost, ValidateInput(false)]
        public void addDashboardForUser(UserApps userAppsObj)
        {

            foreach (UserApp userApp in userAppsObj.userApps)
            {
                DashboardForUser tester = new DashboardForUser() { GUID = Guid.NewGuid(), dashboardName = userApp.AppName, UserName = userApp.UserName };
                var repository = Uow.GetEntityRepository<DashboardForUser>();
                //Insert
                var inserted = repository.InsertOrUpdate(tester);
                Uow.Commit();
            }

            
        }



        // GET: /Dashboard/
        [HttpPost, ValidateInput(false)]
        public ActionResult Index(FormCollection Form)
        {
            var results = (ActionResult)RedirectToAction("Index", "Home");
            String name = Convert.ToString(Form["Dashboard Name"]);
            String v = Convert.ToString(Form["view"]);
            String vm = Convert.ToString(Form["viewmodel"]);

            string path = Server.MapPath(@"html5\App\apps\");
            path = path + name;
            try
            {
                // Determine whether the directory exists. 
                if (Directory.Exists(path))
                {
                    Debug.WriteLine("That path exists already.");
                    return results;
                }

                // Try to create the directory.
                DirectoryInfo di = Directory.CreateDirectory(path);
                DirectoryInfo di_v = Directory.CreateDirectory(path + "/views");
                DirectoryInfo di_vm = Directory.CreateDirectory(path + "/viewmodels");
                Debug.WriteLine("The directory was created successfully at {0}.", Directory.GetCreationTime(path));

                String view_file = path + "\\views\\" + name + ".html";
                String viewmodel_file = path + "\\viewmodels\\" + name + ".js";
                if (!System.IO.File.Exists(view_file))
                {
                    System.IO.File.WriteAllText(@view_file, v);
                    System.IO.File.WriteAllText(@viewmodel_file, vm);
                }
                else
                {
                    Console.WriteLine("view File \"{0}\" already exists.", di);
                    return results;
                }


                // Delete the directory.
                //di.Delete();
                //Debug.WriteLine("The directory was deleted successfully.");
            }
            catch (Exception e)
            {
                Debug.WriteLine("The process failed: {0}", e.ToString());
            }
            finally { }

            return results;
        }

        public JsonResult GetDBperUserJsonData()
        {
            var currentUser = User.Identity.Name;
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<DashboardForUser>();
            var alldashboards = repository.GetAll();
            alldashboards = alldashboards.Where(t => t.UserName == currentUser);

           
           // var query = alldashboards.Select(t => new { Name = t.dashboardName, Apps = getApps(t.dashboardName) });
            var q = new List<object>();
            foreach (DashboardForUser x in alldashboards) {
                q.Add(new { Name = x.dashboardName, Apps = getApps(x.dashboardName) });

            }

            //q.Add(new { Name = "Madhu", Apps = "app1,app2" });
            //q.Add(new { Name = "Samu", Apps = "app1,app2" });
            return Json(q, JsonRequestBehavior.AllowGet);

        }
        public string getApps(String DashboardName)
        {
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<ApplicationForDashboard>();
            var allapps = repository.GetAll();
            allapps = allapps.Where(t => t.dashboardName == DashboardName);
            string applist = "";
            foreach (var app in allapps)
            {
                applist = applist + "," + app.AppName;
            }

            return applist;

        }


    }
}
