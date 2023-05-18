using DataTrackr_API.Models;
using Microsoft.EntityFrameworkCore;
using DataTrackr_API.Models;

namespace DataTrackr_Web_API.Models
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Coordinates> Coordinates { get; set; }
        public DbSet<User> Users { get; set; }        
        public DbSet<Logs> Logs { get; set; }
        

        public DbSet<Coordinates> coordinates{get;set;}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .HasKey(a => a.Acc_email);

            modelBuilder.Entity<Customer>()
                .HasKey(c => c.email);

            modelBuilder.Entity<Coordinates>()
                .HasKey(l => new {l.latitude,l.longitude,l.Acc_email});

            modelBuilder.Entity<Customer>()
                .HasMany(c => c.Accounts)
                .WithOne(a => a.Customer)
                .HasForeignKey(a => a.Customer_email);

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Location)
                .WithOne(l => l.Account)
                .HasForeignKey<Coordinates>(c=> c.Acc_email);
        }


    }
}
