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
    public class ToDoCheckboxType : ObjectType<ToDoCheckbox>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoCheckbox> descriptor)
        {
            descriptor.Description("Represents a to-do checkbox.");

            descriptor
                .Field(c => c.NoteId)
                .Ignore();

            descriptor
                .Field(c => c.Note)
                .ResolveWith<Resolvers>(r => Resolvers.GetNote(default, default))
                .UseDbContext<ToDosDbContext>()
                .Description("Gets the checkbox's note.");
        }

        private class Resolvers
        {
            [UseDbContext(typeof(ToDosDbContext))]
            public static ToDoNote GetNote(ToDoCheckbox checkbox, [ScopedService] ToDosDbContext context)
            {
                return context.Notes.FirstOrDefault(n => n.Id == checkbox.NoteId);
            }
        }
    }
}
