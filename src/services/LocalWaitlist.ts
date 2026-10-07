/** Local-only implementation of the reference form's response contract. */
interface LocalMember {
  uuid: string;
  email: string;
  waitlist_animal: string;
  profile_complete: boolean;
  referral_url: string;
  effective_position: number;
  waitlist_number: number;
  name?: string;
  age?: string;
  location?: string;
  status?: string;
  university?: string;
  about?: string;
}
const storageKey = "trapnest-zero:local-keepsakes";
function readMembers(): LocalMember[] {
  try {
    return JSON.parse(
      localStorage.getItem(storageKey) ?? "[]",
    ) as LocalMember[];
  } catch {
    return [];
  }
}
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function localWaitlistRequest(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const url = new URL(input, location.origin);
  if (url.pathname.endsWith("Zero-University-Log-Landing"))
    return json({
      success: true,
    });
  const members = readMembers();
  if (url.pathname.endsWith("Get-Zero-Waitlist-User")) {
    const member = members.find((m) => m.uuid === url.searchParams.get("uuid"));
    return member
      ? json(member)
      : json(
          {
            error: "Member not found",
          },
          404,
        );
  }
  const data = JSON.parse(String(init?.body ?? "{}")) as Partial<LocalMember>;
  if (url.pathname.endsWith("Join-Zero-Waitlist-Signup")) {
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return json(
        {
          error: "Enter a valid email",
        },
        400,
      );
    const existing = members.find((m) => m.email === data.email);
    if (existing)
      return json({
        ...existing,
        already_exists: true,
      });
    const uuid = crypto.randomUUID();
    const member: LocalMember = {
      uuid,
      email: data.email,
      waitlist_animal: data.waitlist_animal ?? "angelfish",
      profile_complete: false,
      referral_url: `https://zero.henrywithu.com/`,
      effective_position: members.length + 1,
      waitlist_number: members.length + 1,
    };
    members.push(member);
    localStorage.setItem(storageKey, JSON.stringify(members));
    return json({
      ...member,
      already_exists: false,
    });
  }
  if (url.pathname.endsWith("Join-Zero-Beta-Waitlist-Profile")) {
    const member = members.find((m) => m.uuid === data.uuid);
    if (!member)
      return json(
        {
          success: false,
          error: "Member not found",
        },
        404,
      );
    Object.assign(member, data, {
      profile_complete: true,
    });
    localStorage.setItem(storageKey, JSON.stringify(members));
    return json({
      ...member,
      success: true,
    });
  }
  return json(
    {
      error: "Unknown local action",
    },
    404,
  );
}
