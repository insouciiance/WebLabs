using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.Models;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoNoteType : ObjectType<ToDoNote>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoNote> descriptor)
        {
            descriptor.Description("Represents a to-do note.");

            descriptor
                .Field(n => n.UserId)
                .Ignore();

            descriptor
                .Field(n => n.Checkboxes)
                .ResolveWith<Resolvers>(r => r.GetCheckboxes(default, default))
                .UseDbContext<ToDosDbContext>()
                .Description("Gets all checkboxes inside the note.");

            descriptor
                .Field(n => n.User)
                .ResolveWith<Resolvers>(r => r.GetUser(default, default))
                .UseDbContext<ToDosDbContext>()
                .Description("Gets the user to whom the note belongs");
        }

        private class Resolvers
        {
            [UseDbContext(typeof(ToDosDbContext))]
            public IQueryable<ToDoCheckbox> GetCheckboxes(ToDoNote note, [ScopedService] ToDosDbContext context)
            {
                return context.Checkboxes.Where(n => n.NoteId == note.Id);
            }

            public ApplicationUser GetUser(ToDoNote note, [Service] ToDosDbContext context)
            {
                return context.Users.FirstOrDefault(u => u.Id == note.UserId);
            }
        }
    }
}
