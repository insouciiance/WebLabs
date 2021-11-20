using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using ToDoWebApi.GraphQL.ToDos;

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
            JwtSecurityTokenHandler handler = new ();
            JwtSecurityToken token = handler.ReadJwtToken(jwtToken);

            string userId = token.Claims.First().Value;

            return await eventReceiver.SubscribeAsync<string, OnNotesUpdateMessage>("OnNotesUpdate_" + userId, cancellationToken);
        }
    }
}
