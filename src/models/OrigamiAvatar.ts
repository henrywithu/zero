// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { createWaitlistOverlay } from "../components/WaitlistOverlay.ts";
import { _E } from "../components/Referral.ts";
import { createJoinForm } from "../components/JoinForm.ts";
import { getOrigamiModelUrl, getOrigamiAoUrl } from "./origami.ts";
import { Fw } from "../services/waitlistState.ts";
import { createEmailGate } from "../components/EmailGate.ts";
var RD: any = (): any => ({
  name: ``,
  age: ``,
  city: ``,
  education: ``,
  university: ``,
  notes: ``,
});
var zD: any = {
  step: 1,
  email: ``,
  asset: null,
  registered: !1,
  referralUrl: null,
  memberNumber: null,
  aheadCount: null,
  formData: RD(),
};
var BD: any = (): any => {
  let e: any = (zD.formData.education || ``).trim();
  return e === `graduate` || e === `other`
    ? `so-called university`
    : (zD.formData.university || ``).trim();
};
function VD(
  this: any,
  e?: any,
  t?: any,
  {
    onAllStepsComplete: n = null,
    onJoinFormClose: r = null,
    onCloseStart: i = null,
    showEntryAnimation: a = !0,
    entryAnimationDuration: o = 2,
    autoExpandEmail: s = !1,
    onDismiss: c = null,
    muffleFloor: l = 0,
    gate: u = null,
    routeEmail: d = null,
  }: any = {},
): any {
  let f: any = null,
    p: any = null,
    m: any = null,
    h: any = null,
    g: any = (
      e?: any,
      { skipToEnd: t = !1, assetUrl: n = null, aoUrl: r = null }: any = {},
    ): any => {
      m = createWaitlistOverlay({
        host: e,
        skipToEnd: t,
        assetUrl: n,
        aoUrl: r,
        university: BD(),
        userName: (zD.formData.name || ``).trim(),
        onComplete: (i?: any): any => {
          zD.step = 3;
          h = _E({
            host: e,
            sceneSlot: i.sceneEl,
            skipFlip: t,
            setSceneAutoRotate: i.setAutoRotate,
            pauseScene: i.pause,
            resumeScene: i.resume,
            userName: (zD.formData.name || ``).trim(),
            university: BD(),
            assetUrl: n,
            aoUrl: r,
            referralUrl: zD.referralUrl || null,
            aheadCount: zD.aheadCount ?? null,
            memberNumber: zD.memberNumber ?? null,
          });
        },
      });
      zD.step < 2 && (zD.step = 2);
    },
    _: any = (): any => {
      f && (f.collapse(), f.show());
    },
    v: any = (): any => {
      let e: any = !!(m || h);
      h && typeof h.destroy == `function` && h.destroy();
      m && typeof m.destroy == `function` && m.destroy();
      h = null;
      m = null;
      p = null;
      e ? (n ? n() : _()) : r ? r() : _();
    },
    y: any = ({ hideStep1: e, onSubmitSuccess: n = null }: any): any =>
      createJoinForm({
        frameEl: t,
        email: zD.email,
        autoOpen: !0,
        initialFormData: zD.formData,
        hideStep1Content: e,
        muffleFloor: l,
        onFormDataChange: (e?: any): any => {
          zD.formData = {
            ...zD.formData,
            ...e,
          };
        },
        onCloseStart: i,
        onClose: v,
        onSubmitSuccess: n,
      }),
    b: any = (): any => {
      f && f.hide();
      p = y({
        hideStep1: !1,
        onSubmitSuccess: ({ panel: e, asset: t, position: n }: any): any => {
          t != null && (zD.asset = t);
          n != null && (zD.aheadCount = n);
          let r: any = zD.asset;
          g(e, {
            assetUrl: getOrigamiModelUrl(r),
            aoUrl: getOrigamiAoUrl(r),
          });
        },
      });
    },
    x: any = (e?: any): any => {
      f && f.hide();
      zD.step = 3;
      p = y({
        hideStep1: !0,
      });
      let t: any = e.asset;
      g(p.panel, {
        skipToEnd: !0,
        assetUrl: t == null ? null : getOrigamiModelUrl(t),
        aoUrl: t == null ? null : getOrigamiAoUrl(t),
      });
    },
    S: any = async (e?: any): Promise<any> => {
      e !== zD.email &&
        ((zD.formData = RD()), (zD.asset = null), (zD.step = 1));
      zD.email = e;
      f && f.setBusy(!0);
      let t: any;
      try {
        t = await Fw(e);
      } catch {
        t = {
          registered: !1,
          profileComplete: !1,
        };
      }
      f && f.setBusy(!1);
      zD.asset = t.asset;
      zD.referralUrl = t.referralUrl || null;
      zD.memberNumber = t.memberNumber ?? null;
      zD.aheadCount = t.aheadCount ?? null;
      zD.registered = !!t.profileComplete;
      let n: any = !!(
        t.name ||
        t.university ||
        t.city ||
        t.education ||
        t.notes
      );
      t.uuid &&
        n &&
        (zD.formData = {
          name: t.name || ``,
          age: t.age || ``,
          city: t.city || ``,
          education: t.education || ``,
          university: t.university || ``,
          notes: t.notes || ``,
        });
      t.profileComplete ? x(t) : b();
    };
  u
    ? ((f = u),
      f.setOnEmail(S),
      f.setOnBack(c ? (): any => (c(), !0) : null),
      zD.email && f.setInitialEmail(zD.email))
    : ((f = createEmailGate({
        onEmail: S,
        initialEmail: zD.email,
        showEntryAnimation: a,
        entryAnimationDuration: o,
        onBack: c ? (): any => (c(), !0) : null,
      })),
      s && requestAnimationFrame((): any => f && f.expandToInput()));
  d && S(d);
  return {
    emailGate: f,
    openEmail: (): any => {
      f && f.expandToInput();
    },
    getForm: (): any => p,
    destroy: (): any => {
      h && typeof h.destroy == `function` && h.destroy();
      m && typeof m.destroy == `function` && m.destroy();
      p && typeof p.destroy == `function` && p.destroy();
      !u && f && typeof f.destroy == `function` && f.destroy();
      f = null;
    },
  };
}
export { RD, zD, BD, VD };
