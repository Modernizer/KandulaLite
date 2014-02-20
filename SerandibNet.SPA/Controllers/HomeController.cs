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

using System.Web.Security;
using SerandibNet.SPA;
using SerandibNet.Model;
using SerandibNet.Model.Entities;
using SerandibNet.SPA.DataAccessHelpers;

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
            //DatabaseScript x = new DatabaseScript();
            //x.populateDB();
          
            ViewBag.ReturnUrl = returnUrl;
            //  ViewBag.users=["a","b"];
            return View();
        }

        public ActionResult Autocomplete(string term)
        {
            //get apps accessible for this user
            var items = new[] { "App1", "App2", "QueryBuiler", "Hello", "Profile", "Home" };

            var filteredItems = items.Where(
                item => item.IndexOf(term, StringComparison.InvariantCultureIgnoreCase) >= 0
                );
            return Json(filteredItems, JsonRequestBehavior.AllowGet);
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

        //public ActionResult GetDashboards()
        //{
        //    List<Dashboard> DashboardList = new List<Dashboard>();
        //    String currentUser = User.Identity.Name;

        //    if (currentUser == "madhu")
        //    {
        //        Dashboard d1 = new Dashboard
        //        {
        //            name = "madu1",
        //            Apps = { "app1", "app2" }

        //        };
        //        Dashboard d2 = new Dashboard
        //        {
        //            name = "madu2",
        //            Apps = { "app3" }

        //        };
        //        DashboardList.Add(d1);
        //        DashboardList.Add(d2);
        //    }
        //    return Json(DashboardList, JsonRequestBehavior.AllowGet);
        //}

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