using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.Models;

namespace ToDoWebApi.GraphQL.Users
{
    public class ApplicationUserType : ObjectType<ApplicationUser>
    {
        protected override void Configure(IObjectTypeDescriptor<ApplicationUser> descriptor)
        {
            descriptor.Description("Represents an application user.");

            descriptor
                .Field(u => u.Id)
                .Ignore();

            descriptor
                .Field(u => u.AccessFailedCount)
                .Ignore();

            descriptor
                .Field(u => u.ConcurrencyStamp)
                .Ignore();

            descriptor
                .Field(u => u.EmailConfirmed)
                .Ignore();

            descriptor
                .Field(u => u.NormalizedEmail)
                .Ignore();

            descriptor
                .Field(u => u.LockoutEnabled)
                .Ignore();

            descriptor
                .Field(u => u.LockoutEnd)
                .Ignore();

            descriptor
                .Field(u => u.NormalizedUserName)
                .Ignore();

            descriptor
                .Field(u => u.PasswordHash)
                .Ignore();

            descriptor
                .Field(u => u.PhoneNumber)
                .Ignore();

            descriptor
                .Field(u => u.PhoneNumberConfirmed)
                .Ignore();

            descriptor
                .Field(u => u.SecurityStamp)
                .Ignore();

            descriptor
                .Field(u => u.TwoFactorEnabled)
                .Ignore();

            descriptor
                .Field(u => u.Notes)
                .ResolveWith<Resolvers>(r => Resolvers.GetNotes(default, default))
                .UseDbContext<ToDosDbContext>()
                .Description("Gets the user's notes.");
        }

        private class Resolvers
        {
            public static IQueryable<ToDoNote> GetNotes(ApplicationUser user, [Service] ToDosDbContext context)
            {
                return context.Notes.Where(n => n.UserId == user.Id);
            }
        }
    }
}
