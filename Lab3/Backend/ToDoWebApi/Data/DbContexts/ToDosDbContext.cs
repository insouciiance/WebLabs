using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using ToDoWebApi.Models;

namespace ToDoWebApi.Data.DbContexts
{
    public class ToDosDbContext : IdentityDbContext<ApplicationUser>
    {
        public override DbSet<ApplicationUser> Users { get; set; }

        public DbSet<ToDoNote> Notes { get; set; }

        public DbSet<ToDoCheckbox> Checkboxes { get; set; }

        public ToDosDbContext(DbContextOptions options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<ApplicationUser>()
                .HasMany(u => u.Notes)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId);

            modelBuilder
                .Entity<ToDoNote>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.UserId);

            modelBuilder
                .Entity<ToDoCheckbox>()
                .HasOne(c => c.Note)
                .WithMany(n => n.Checkboxes)
                .HasForeignKey(c => c.NoteId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
