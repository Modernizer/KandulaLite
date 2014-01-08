using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

using System.Configuration;
using System.Data.Entity;
using SarandibNet.Data.Core;
using SarandibNet.Data;
using SarandibNet.Model;
using SarandibNet.Model.Entities;
using System.Web.Security;
using SerandibNet.SPA;
using SerandibNet.Model;
using SerandibNet.Model.Entities;

namespace SerandibNet.SPA.Controllers
{
    public class AppUserModel
    {
        public String username { get; set; }
        public String usertype { get; set; }

    }

    public class HomeController : Controller
    {
        public ActionResult Index(string returnUrl)
        {
            //addUsers();
            //addApps();
            ViewBag.ReturnUrl = returnUrl;
            //  ViewBag.users=["a","b"];
            return View();
        }


        private static UnitOfWork Uow { get; set; }
        [HttpPost, ValidateInput(false)]
        public JsonResult SaveUser(AppUserModel userObject)
        {
            String username = Convert.ToString(userObject.username);
            String usertype = Convert.ToString(userObject.usertype);

            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<AppUser>();
            AppUser appusr = new AppUser() { GUID = Guid.NewGuid(), UserName = username, UserType = usertype };
            
            var inserted_prod = repository.InsertOrUpdate(appusr);
            Uow.Commit();
            
            return null;


        }

        public ActionResult GetDashboards()
        {
            List<Dashboard> DashboardList = new List<Dashboard>();
            String currentUser = User.Identity.Name;

            if (currentUser == "madhu")
            {
                Dashboard d1 = new Dashboard
                {
                    name = "madu1",
                    Apps = { "app1", "app2" }

                };
                Dashboard d2 = new Dashboard
                {
                    name = "madu2",
                    Apps = { "app3" }

                };
                DashboardList.Add(d1);
                DashboardList.Add(d2);
            }
            return Json(DashboardList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUsers()
        {
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<AppUser>();
            var allUsers = repository.GetAll();

            var userslist = new List<user>();
            int i = 0;
            foreach (AppUser user in allUsers)
            {
                userslist.Add(new user { Id = i, Name = user.UserName });
                i++;
            }

            return Json(userslist.ToList(), JsonRequestBehavior.AllowGet);
        }
 


     
        public void addUsers()
        {
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<AppUser>();

            AppUser tester = new AppUser() { GUID = Guid.NewGuid(), UserName = "samudra" };
            //Insert
            var inserted = repository.InsertOrUpdate(tester);
            Uow.Commit();

            AppUser tester1 = new AppUser() { GUID = Guid.NewGuid(), UserName = "ravini" };
            //Insert
            var inserted1 = repository.InsertOrUpdate(tester1);
            Uow.Commit();

            AppUser tester2 = new AppUser() { GUID = Guid.NewGuid(), UserName = "samudra1" };
            //Insert
            var inserted2 = repository.InsertOrUpdate(tester2);
            Uow.Commit();

            AppUser tester3 = new AppUser() { GUID = Guid.NewGuid(), UserName = "madhu" };
            //Insert
            var inserted3 = repository.InsertOrUpdate(tester3);
            Uow.Commit();

        }

        public void addApps() {
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<Application>();

           

            Application tester = new Application() { GUID = Guid.NewGuid(), Name="app-editor" };
            //Insert
            var inserted = repository.InsertOrUpdate(tester);
            Uow.Commit();

            Application tester1 = new Application() { GUID = Guid.NewGuid(), Name = "ChartDesigner" };
            //Insert
            var inserted1 = repository.InsertOrUpdate(tester1);
            Uow.Commit(); 

        }

        public class Dashboard
        {
            public String name { get; set; }
            public List<String> Apps { get; set; }

        }
        public class user
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

    }
}