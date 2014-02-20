using SarandibNet.Data.Core;
using SerandibNet.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SarandibNet.Model
{
    public class Application : IIdentifier
    {
        public int Id { get; set; }
        public Guid GUID { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public string Metadata { get; set; }
        public DateTime ModifiedTime { get; set; }
        
        public virtual List<ApplicationView> ApplicationViews { get; set; }
        public virtual List<ApplicationViewModel> ApplicationViewModels { get; set; }

        public void AddApplicationView(ApplicationView view)
        {
            if (ApplicationViews == null)
            {
                ApplicationViews = new List<ApplicationView>();
            }

            ApplicationViews.Add(view);
        }

        public void AddApplicationViewModel(ApplicationViewModel viewModel)
        {
            if (ApplicationViewModels == null)
            {
                ApplicationViewModels = new List<ApplicationViewModel>();
            }

            ApplicationViewModels.Add(viewModel);
        }
    }
}