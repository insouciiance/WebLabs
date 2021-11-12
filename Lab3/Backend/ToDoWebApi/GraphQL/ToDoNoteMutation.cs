using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.GraphQL.ToDos;
using ToDoWebApi.Models;
using ToDoWebApi.Services;
using ToDoWebApi.Services.Extensions;
using ToDoWebApi.Services.Validators;

namespace ToDoWebApi.GraphQL
{
    [GraphQLDescription("Represents the mutation operating on notes.")]
    [ExtendObjectType("Mutation")]
    public class ToDoNoteMutation
    {
        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNotePayload> AddNote(
            ToDoNoteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoNoteInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoNote newNote = new()
            {
                Id = Guid.NewGuid().ToString(),
                Name = input.Name,
                UserId = userId,
                DateCreated = DateTime.Now
            };

            context.Notes.Add(newNote);

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoNotePayload(newNote);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNotePutPayload> PutNote(
            ToDoNotePutInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoNotePutInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoNote noteToPut = context.Notes.FirstOrDefault(n => n.Id == input.Id);

            if (noteToPut is null || noteToPut.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateNote);
            }

            noteToPut.Name = input.Name;

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoNotePutPayload(noteToPut);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNoteDeletePayload> DeleteNote(
            ToDoNoteDeleteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoNoteDeleteInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoNote noteToDelete = context.Notes.FirstOrDefault(n => n.Id == input.Id);

            if (noteToDelete is null || noteToDelete.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteNote);
            }

            context.Notes.Remove(noteToDelete);

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoNoteDeletePayload(true);
        }
    }
}