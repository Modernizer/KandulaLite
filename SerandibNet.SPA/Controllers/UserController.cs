using SerandibNet.SPA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace  SerandibNet.SPA.Controllers{
    public class UserController : Controller
    {
        //
        // GET: /User/

        public ActionResult Index()
        {
            /*return notifications recieved by logged user role
             * (new Bussiness_Service()).GetNotificationsOfUserRole(..);
             */

            /*dummy data*/
           // string[] roleNames = Roles.GetRolesForUser();
            /*get 0 th index since we dont use multiple roles for one user in this demo application*/
            //IList<Notification> noti = GetNotificationsOfUserRole(roleNames[0]);

            return View();
        }

        /*menu actions*/
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
            /*return unread notifications recieved by logged user role
            * (new Bussiness_Service()).GetNotificationsOfUserRole(..);
            */

            /*dummy data*/
           // string[] roleNames = Roles.GetRolesForUser();
            /*get 0 th index since we dont use multiple roles for one user in this demo application*/
            //IList<ceyglass.application.Models.Notification> noti = GetUnreadNotificationsOfUserRole(roleNames[0]);

            return PartialView(null);
        }

        /*end of menu actions*/

        /*dashboard actions*/

        public ActionResult DashboardProfile()
        {
            return PartialView();
        }

        public ActionResult NotificationBox()
        {
            return PartialView();
        }

        public ActionResult Inbox()
        {
            return PartialView();
        }

        /*rebind partial view*/
        public ActionResult ChangeNotificationStatus(int notiId, bool currentState/*IsRead*/)
        {
            /*change status of the notification
             * (new Bussiness_Service()).ChangeStatus(..);
             */

            /*rebind partial view with updated data
             * (new Bussiness_Service()).GetNotificationsOfUserRole(..);
             */

            /*dummy data*/
            string[] roleNames = Roles.GetRolesForUser();
            /*get 0 th index since we dont use multiple roles for one user in this demo application*/
            IList<Notification> noti = GetNotificationsOfUserRole(roleNames[0]);

            return PartialView("NotificationBox", noti);
        }

        /*end of dashboard actions*/

        #region sample data
        /*sample data*/
        public IList<Notification> GetNotificationsOfUserRole(string role)
        {
            return AllNotifications().Where(x => x.ReceiversRole == role).ToList();
        }

        public IList<Notification> GetUnreadNotificationsOfUserRole(string role)
        {
            return AllNotifications().Where(x => x.ReceiversRole == role && !x.IsRead).ToList();
        }

        public IList<Notification> AllNotifications()
        {
            IList<Notification> noti = new List<Notification>();

            noti.Add(new Notification()
            {
                Id = 1,
                Sender = "Samudra",
                Message = "Production for ABC (pvt) ltd order placed on 10/01/2013 on order number 10120 has been completed !",
                SentOn = DateTime.Now,
                IsRead = false,
                ReceiversRole = "Merchandiser"
            });

            noti.Add(new Notification()
            {
                Id = 1,
                Sender = "Samudra",
                Message = "Production for Sunil Ltd order placed on 11/01/2013 on order number 10120 will be completed by 10/22/2013 !",
                SentOn = DateTime.Now,
                IsRead = true,
                ReceiversRole = "Merchandiser"
            });

            noti.Add(new Notification()
            {
                Id = 1,
                Sender = "Hirushan",
                Message = "Raw materials for request Id 20453 is ready for collection !",
                SentOn = DateTime.Now,
                IsRead = false,
                ReceiversRole = "ProductionManager"
            });

            noti.Add(new Notification()
            {
                Id = 1,
                Sender = "Hirushan",
                Message = "Raw materials for request Id 20453 cannot be satisfy at this moment. Due to insufficent stocks in hand. ! Will be on hold and to be delivered by 10/22/2013",
                SentOn = DateTime.Now,
                IsRead = false,
                ReceiversRole = "ProductionManager"
            });

            return noti;
        }

        #endregion
    }
}
