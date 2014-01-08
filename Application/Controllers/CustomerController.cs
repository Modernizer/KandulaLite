using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ceyglass.application.Controllers
{
    public class CustomerController : Controller
    {
        //
        // GET: /Customer/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllCustomers()
        {

            /*
             * IList<customer>
             * properties-->
             * id int,
             * name string,
             * address string,
             * contact_numbers string,
             * email string,
             * website string?,
             * description string?
             */

            return Json(new { /*customer_list=  IList<customer>*/});
        }

        public JsonResult AddEditCustomer(/*customer object*/)
        {
            /*for add and edit same method can be used and on edit mode customer Id will be passed through the customer object*/
            /*add to database and return whether its success or not, i assume that the fields mentioned above are the
             fields on the customer table, if not let me know the additional fields if there is any*/

            return Json(new { /*isSuccess*/});
        }

        public JsonResult GetCustomerById(int customerId)
        {
            return Json(new { /*customer object*/});
        }
    }
}
