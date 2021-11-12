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
    [GraphQLDescription("Represents the mutation operating on checkboxes.")]
    [ExtendObjectType("Mutation")]
    public class ToDoCheckboxMutation
    {
        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPayload> AddCheckbox(
            ToDoCheckboxInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoCheckboxInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;
            ToDoNote checkboxNote = context.Notes.FirstOrDefault(n => n.Id == input.NoteId);

            if (checkboxNote is null || checkboxNote.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantAddCheckbox);
            }

            ToDoCheckbox checkbox = new()
            {
                Id = Guid.NewGuid().ToString(),
                NoteId = checkboxNote.Id,
                Text = input.Text,
                Checked = false
            };

            context.Checkboxes.Add(checkbox);

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoCheckboxPayload(checkbox);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPutPayload> PutCheckbox(
            ToDoCheckboxPutInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoCheckboxPutInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToPut = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToPut is null)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            await context.Entry(checkboxToPut).Navigation("Note").LoadAsync(cancellationToken);

            if (checkboxToPut.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            checkboxToPut.Text = input.Text;
            checkboxToPut.Checked = input.Checked;

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoCheckboxPutPayload(checkboxToPut);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxDeletePayload> DeleteCheckbox(
            ToDoCheckboxDeleteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoCheckboxDeleteInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToDelete = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToDelete is null)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            await context.Entry(checkboxToDelete).Navigation("Note").LoadAsync(cancellationToken);

            if (checkboxToDelete.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            context.Checkboxes.Remove(checkboxToDelete);

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoCheckboxDeletePayload(true);
        }
    }
}
