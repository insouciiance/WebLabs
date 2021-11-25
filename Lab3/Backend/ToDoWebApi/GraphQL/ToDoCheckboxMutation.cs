using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ganss.XSS;
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
        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPayload> AddCheckbox(
            ToDoCheckboxInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            HtmlSanitizer sanitizer = new ();
            ToDoCheckboxInput sanitizedInput = new (
                sanitizer.Sanitize(input.Text),
                sanitizer.Sanitize(input.NoteId));

            ToDoCheckboxInputValidator validator = new ();
            await validator.ValidateAndThrowGraphQLExceptionAsync(sanitizedInput).ConfigureAwait(false);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;
            ToDoNote checkboxNote = context.Notes.FirstOrDefault(n => n.Id == sanitizedInput.NoteId);

            if (checkboxNote is null || checkboxNote.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantAddCheckbox);
            }

            ToDoCheckbox checkbox = new ()
            {
                Id = Guid.NewGuid().ToString(),
                Text = sanitizedInput.Text,
                Checked = false,
                DateCreated = DateTime.Now,
                NoteId = checkboxNote.Id
            };

            context.Checkboxes.Add(checkbox);

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken).ConfigureAwait(false);

            return new ToDoCheckboxPayload(checkbox);
        }

        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPutPayload> PutCheckbox(
            ToDoCheckboxPutInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            HtmlSanitizer sanitizer = new ();
            ToDoCheckboxPutInput sanitizedInput = new (
                sanitizer.Sanitize(input.Id),
                sanitizer.Sanitize(input.Text),
                input.Checked);

            ToDoCheckboxPutInputValidator validator = new ();
            await validator.ValidateAndThrowGraphQLExceptionAsync(sanitizedInput).ConfigureAwait(false);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToPut = context.Checkboxes.FirstOrDefault(c => c.Id == sanitizedInput.Id);

            if (checkboxToPut is null)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            await context.Entry(checkboxToPut).Navigation("Note").LoadAsync(cancellationToken).ConfigureAwait(false);

            if (checkboxToPut.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            checkboxToPut.Text = sanitizedInput.Text;
            checkboxToPut.Checked = sanitizedInput.Checked;

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken).ConfigureAwait(false);

            return new ToDoCheckboxPutPayload(checkboxToPut);
        }

        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxDeletePayload> DeleteCheckbox(
            ToDoCheckboxDeleteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            HtmlSanitizer sanitizer = new ();
            ToDoCheckboxDeleteInput sanitizedInput = new (
                sanitizer.Sanitize(input.Id));

            ToDoCheckboxDeleteInputValidator validator = new ();
            await validator.ValidateAndThrowGraphQLExceptionAsync(sanitizedInput).ConfigureAwait(false);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToDelete = context.Checkboxes.FirstOrDefault(c => c.Id == sanitizedInput.Id);

            if (checkboxToDelete is null)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            await context.Entry(checkboxToDelete).Navigation("Note").LoadAsync(cancellationToken).ConfigureAwait(false);

            if (checkboxToDelete.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            context.Checkboxes.Remove(checkboxToDelete);

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken).ConfigureAwait(false);

            return new ToDoCheckboxDeletePayload(true);
        }
    }
}
