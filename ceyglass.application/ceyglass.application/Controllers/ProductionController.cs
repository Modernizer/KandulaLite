using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ceyglass.application.Controllers
{
    public class ProductionController : Controller
    {
        //
        // GET: /Production/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Schedule()
        {
            return View();
        }

        public JsonResult GetRawMaterialAllocatedProductionPlans()
        {
            /*
             * this required a view model of ProductionPlanning where the status is raw material allocated
             * which containing following properties,
             * Id,
             * CustomerOrderId,
             * ProductId,
             * ProductName,
             * TotalRequested,
             * ReservedFinishedGoodQty,
             * TotalQtyToProduce,
             * ProductionFactory
             */

            return Json(new { /*prdPlans=.. IList<ProductionPlanning_ViewModel>*/});
        }

        public JsonResult GetCustomerOrderById(int orderId)
        {
            /*
             * this requires a view model of customer order object containing,
             * Id,
             * CustomerId,
             * CustomerName,
             * OrderDate,
             * RequiredDeliveryDate,
             * EstimatedCost,
             * DeliveryAddress,
             * DeliveryInstructions
             */

            return Json(new {/*order= .. Order_ViewModel*/ });
        }
    }
}
