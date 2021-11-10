using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using ToDoWebApi.GraphQL.ToDos;
using ToDoWebApi.GraphQL.Users;

namespace ToDoWebApi.GraphQL
{
    public class Subscription
    {
        [Subscribe(With = nameof(SubscribeToOnNotesUpdateAsync))]
        [Topic]
        public OnNotesUpdateMessage OnNotesUpdate(string jwtToken, [EventMessage] OnNotesUpdateMessage message)
        {
            return message;
        }

        public async ValueTask<ISourceStream<OnNotesUpdateMessage>> SubscribeToOnNotesUpdateAsync(
            string jwtToken,
            [Service] ITopicEventReceiver eventReceiver,
            CancellationToken cancellationToken)
        {
            return await eventReceiver.SubscribeAsync<string, OnNotesUpdateMessage>("OnNotesUpdate_" + jwtToken, cancellationToken);
        }
    }
}
