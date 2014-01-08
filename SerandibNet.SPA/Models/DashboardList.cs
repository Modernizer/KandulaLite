using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SerandibNet.SPA.Models
{
    public class DashboardList
    {
        //List<Dashboard> DashboardList = new List<Dashboard>();

        //   String currentUser = "madhu";

        //   if (currentUser == "madhu")
        //   {
        //       Dashboard d1 = new Dashboard
        //       {
        //           name="madu1",
        //           Apps = { "app1","app2"}
                    
        //       };
        //       Dashboard d2 = new Dashboard
        //       {
        //           name = "madu2",
        //           Apps = { "app3" }

        //       };
        //       DashboardList.Add(d1);
        //       DashboardList.Add(d2);
        //   }
    }


    public class Dashboard {
       public String name { get; set; }
        public List<String> Apps { get; set; }

        }
}