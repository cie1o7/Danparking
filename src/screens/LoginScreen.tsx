import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, FONT_SIZES, SPACING } from '@/utils/constants';
import { SUCCESS_MESSAGES } from '@/utils/constants';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isLoading } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('비밀번호는 6자 이상 입력해주세요.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const isFormValid = (): boolean => {
    return validateEmail(email) && validatePassword(password);
  };

  const handleLogin = async () => {
    if (!isFormValid() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await login(email, password);
      
      Toast.show({
        type: 'success',
        text1: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '이메일과 비밀번호를 확인해주세요.';
      
      Toast.show({
        type: 'error',
        text1: '로그인 실패',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      validatePassword(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {/* 앱 로고 및 제목 */}
          <View style={styles.header}>
            <Text style={styles.title}>단주차</Text>
            <Text style={styles.subtitle}>단국대학교 주차장 관리 시스템</Text>
          </View>

          {/* 로그인 폼 */}
          <View style={styles.form}>
            {/* 이메일 입력 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                value={email}
                onChangeText={handleEmailChange}
                placeholder="이메일을 입력하세요"
                placeholderTextColor={COLORS.text.light}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting && !isLoading}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={COLORS.text.light}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting && !isLoading}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!isFormValid() || isSubmitting || isLoading) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!isFormValid() || isSubmitting || isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isSubmitting || isLoading ? '로그인 중...' : '로그인'}
              </Text>
            </TouchableOpacity>

            {/* 회원가입 링크 */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>계정이 없으신가요? </Text>
              <TouchableOpacity
                disabled={isSubmitting || isLoading}
                onPress={() => {
                  // TODO: 회원가입 화면으로 이동
                  Alert.alert('알림', '회원가입 기능은 추후 구현 예정입니다.');
                }}
              >
                <Text style={styles.signupLink}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.surface,
    color: COLORS.text.primary,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  loginButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.text.light,
  },
  loginButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.background,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  signupText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  signupLink: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;