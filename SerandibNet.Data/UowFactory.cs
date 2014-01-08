using SarandibNet.Data.Core;
using SarandibNet.Data.Seed;
using SarandibNet.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SarandibNet.Data
{
    public static class UowFactory
    {
        /// <summary>
        /// Creates a DB context and attach that to a UnitOfWork instance.
        /// </summary>
        /// <param name="connectionStringName"></param>
        /// <param name="forceDbDrop"></param>
        /// <returns></returns>
        public static IUnitOfWork CreateUnitOfWork(string connectionStringName, bool forceDbDrop = false)
        {
            var context = new DatabaseContext(connectionStringName);
            var uow = new UnitOfWork(context);

            //register any extended entity repository or custom repositories
            //uow.RegisterEntityRepository<Product>(new ProductRepository(context));

            return uow;
        }

        /// <summary>
        /// This must be called to configure the UowFactory to change the initialization behaviour
        /// as prefered.
        /// </summary>
        /// <param name="forceDbDrop">Will drop the existing database at initialization. Defaults to 'false'</param>
        /// <param name="seedSampleData">if true, Db will be populated with sample data. Defaults to 'false'</param>
        public static void Configure(bool forceDbDrop = false, bool seedSampleData = false)
        {
            var seeds = new List<ISeed> { new SeedBaseData() };

            if (seedSampleData) {
                seeds.Add(new SeedSampleData());
            };

            if (forceDbDrop)
            {
                Database.SetInitializer(new DropAlways(seeds));
            }
            else
            {
                Database.SetInitializer(new DropIfChanged(seeds));
            }

        }
    }
}
