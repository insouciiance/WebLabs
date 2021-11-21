using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate.Subscriptions;
using Microsoft.AspNetCore.Http;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.GraphQL.ToDos;
using ToDoWebApi.Models;

namespace ToDoWebApi.Services
{
    public static class SubscriptionMessageEmitter
    {
        public static async Task EmitOnNotesUpdate(
            IHttpContextAccessor contextAccessor,
            ToDosDbContext context,
            ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            IEnumerable<ToDoNote> messageNotes =
                (from note in context.Notes
                    where note.UserId == userId
                    orderby note.DateCreated descending
                    select note).ToArray();

            string sessionId = contextAccessor.HttpContext.Request.Headers["sessionId"].ToString();

            OnNotesUpdateMessage message = new(messageNotes, sessionId);

            string tokenHeader = contextAccessor.HttpContext.Request.Headers["Authorization"].ToString();
            string jwtToken = tokenHeader.Split(' ')[1];

            await eventSender.SendAsync("OnNotesUpdate_" + jwtToken, message, cancellationToken);
        }
    }
}
