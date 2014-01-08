using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ceyglass.application.Controllers
{
    public class CustomerController : Controller
    {
        /*customer object*/

        /*
            public int Id { get; set; }
            public Guid GUID { get; set; }
            [Timestamp]
            public byte[] RowVersion { get; set; }

            public string CustomerName { get; set; }
            public string AddressLine1 { get; set; }
            public string AddressLine2 { get; set; }
            public string AddressCity { get; set; }
            public string PhoneNo { get; set; }
            public string Email { get; set; }
            public string WebSite { get; set; }
            public string Description { get; set; }
        */

        //
        // GET: /Customer/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllCustomers()
        {
            return Json(new { /*customers=  IList<customer>*/});
        }

        public JsonResult ManageCustomerDetails(/*Customer customer*/)
        {
            /*for add and edit same method can be used and on edit mode customer Id will be passed through the 
             * customer object for new customer id will be -1*/

            /*add to database and return whether its success or not (bool), i assume that the fields mentioned above are the
             fields on the customer table, if not let me know the additional fields if there is any*/

            return Json(new { /*isSuccess= (bool)*/});
        }

        public JsonResult GetCustomerById(int customerId)
        {
            return Json(new { /*customer=customer object;*/});
        }
    }
}
