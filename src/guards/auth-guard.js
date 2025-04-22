import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { items } from "src/layouts/dashboard/config";
import { hasPermission } from "src/utils/utils";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);
  const signedIn = useSelector((state) => state.user.signedIn) || false;
  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (ignore.current) {
      return;
    }

    ignore.current = true;

    if (!signedIn) {
      router
        .replace({
          pathname: "/login",
          query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    } else {
      const route = items.find((i) => i.path === router.pathname);
      if (!route) router.replace({ pathname: "/" }).catch(console.error);
      else {
        const disabled =
          route.requires.length > 0
            ? !route.requires.some((p) => hasPermission(p))
            : route.disabled;
        if (disabled) router.replace({ pathname: "/" }).catch(console.error);
        else setChecked(true);
      }
    }
  }, [router.isReady]);

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
