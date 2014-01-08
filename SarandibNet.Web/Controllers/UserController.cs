using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SarandibNet.Web.Controllers
{
    public class UserController : Controller
    {
        //
        // GET: /User/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Messages()
        {
            return PartialView();
        }

        public ActionResult UserMenu()
        {
            return PartialView();
        }


        public ActionResult Notifications()
        {
            return PartialView();
        }
	}
}