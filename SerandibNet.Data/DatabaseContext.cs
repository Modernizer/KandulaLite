using SarandibNet.Data.Core;
using SarandibNet.Model;

using SerandibNet.Model;
using SerandibNet.Model.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SarandibNet.Data
{
    class DatabaseContext : BaseContext
    {
        public DatabaseContext(string connectionStringName) :base (connectionStringName)
        {
            Configuration.ProxyCreationEnabled = true;
            Configuration.LazyLoadingEnabled = true;
            Database.Log = s => LogDbOperations(s); 
        }

        private void LogDbOperations(string s) {
            Debug.Write(s);
        }

        
        public DbSet<Dashboard> Dashboards { get; set; }
        public DbSet<ApplicationViewModel> ApplicationViewModels { get; set; }
        public DbSet<ApplicationView> ApplicationViews { get; set; }
        public DbSet<Application> Application { get; set; }
        public DbSet<DashboardForUser> DashboardForUser { get; set; }
        public DbSet<ApplicationForDashboard> AppForDashboard { get; set; }
        public DbSet<AppUser> AppUser { get; set; }

        //public DbSet<Customer> Customers { get; set; }
        //public DbSet<SoftwareProduct> SoftwareProduct { get; set; }
        //public DbSet<Project> Projects { get; set; }
        //public DbSet<Feature> Stories { get; set; }
        //public DbSet<Component> Components { get; set; }

        //public DbSet<SerandibNet.Model.Task> Tasks { get; set; }
        //public DbSet<Employee> Employees { get; set; }

        //public DbSet<TaskProgress> TaskProgress { get; set; }
        //public DbSet<ProductProgress> ProductProgress { get; set; }
        //public DbSet<FeatureProgress> FeaturProgress { get; set; }
        //public DbSet<ComponentProgress> ComponentProgress { get; set; }

        //public DbSet<ProductExecution> ProductExecution { get; set; }
        //public DbSet<FeatureExecution> FeatureExecution { get; set; }
        //public DbSet<ComponentExecution> ComponentExecution { get; set; }

        //public DbSet<UnitTest> UnitTest { get; set; }
        //public DbSet<IntigrateTest> IntigrateTest { get; set; }
        //public DbSet<DeploymentTest> DeplaymentTests { get; set; }
        //public DbSet<TimeEntry> TimeEntry { get; set; }
        
    }
}
