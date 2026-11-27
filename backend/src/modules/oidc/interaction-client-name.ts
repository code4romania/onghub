/**
 * The client app's name for a pending interaction ("te autentifici în VIC"),
 * read on the server from the interaction itself. Never taken from the
 * request: anyone can ask for a login email, so a name the browser sends
 * would let them put any text in it. Unknown, expired or malformed uid, or
 * the provider off: undefined, and the email names NGO Hub only.
 */
export const INTERACTION_UID = /^[A-Za-z0-9_-]{1,64}$/;

export async function interactionClientName(
  provider: any | null | undefined,
  uid: string | undefined,
): Promise<string | undefined> {
  if (!provider || !uid || !INTERACTION_UID.test(uid)) return undefined;
  try {
    const interaction = await provider.Interaction.find(uid);
    const clientId = interaction?.params?.client_id;
    if (typeof clientId !== 'string') return undefined;
    const client = await provider.Client.find(clientId);
    return client?.clientName ?? undefined;
  } catch {
    return undefined;
  }
}
