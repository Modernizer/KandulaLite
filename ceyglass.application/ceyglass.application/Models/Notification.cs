using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ceyglass.application.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Sender { get; set; }
        public string Message { get; set; }
        public DateTime SentOn { get; set; }
        public bool IsRead { get; set; }
        public string ReceiversRole { get; set; }
    }


}