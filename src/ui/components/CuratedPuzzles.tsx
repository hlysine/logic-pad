import { memo, useEffect, useMemo, useState } from 'react';
import PuzzleCard, { getPuzzleType } from './PuzzleCard';
import { Puzzle } from '../../data/puzzle';
import { Serializer } from '../../data/serializer/allSerializers';
import { Compressor } from '../../data/serializer/compressor/allCompressors';

const serialized: string[] = [
  // Barricaded - Lysine - 5/10 - Underclued
  'dfl_bYzNSgQxEITfpc99mARFDOTg7NWTCjku-VttNiSSzZANju8uo0xmhK3T11VdNRy_oFAJHgSMOmey2nkHCO-ZHAhg_Mr4_Ma4ULFrrBvHHauNjemszN6v1WzVatSOjem8aJ03Zk3qGFVdNR-YmF-DL8VnvMoBmxzw75RPovuP2OTdDZ8xbJKvwbgFHJt8uOH_FvrS4X-BsR7ML1N0PtsweYfCphi9LUcdAtoUUpZO5zMgODqdyE6hNBD3CIHiGQQAgp7KR8og4LldKPrl1V9sps9CKS4v3z8%3D',
  // Movement - Lysine - 9/10 - Pattern
  'dfl_HcqxDoIwFEbhd_nnppEYBjteV13U5I6EQtFGaAlcRGJ9d1On8w1nV30gXnoHg3N8ucEFgcJ98i0MivK9T7eiNMSkmUkTs17typRJOnddLRP_ScTaWpuOhUnXdGniMPZOXDXWIm4KCgqt7zrfLL1sMAeF3ocnDKBQL_KIEwxO2-yDy6ubm8mP4mPIy_cH',
  // The inclusion - /AZURE - 7/10 - Pattern
  'dfl_hZHBTsMwEER_Bc3ZMuSE4htG_EApWolLVacutTBJlDpaqoZ_R85GaQpI7GGkfVrPaNd3mzNSSNHDYH3wN6GuYn8MTQ2Fty7sYFCUn0U5rIvSWLKk2TFrx441EWVC0o2caISkeUaWpDQzs4glsvp3TeOW9GSRTXJO7iQ7kxnRBU3RIuwc_2XP7H7Yy8MrezcjWiD3v31efLGj3EFynMh0myWygqyYjpLb4bEww_OwqpqPNvrkN-02Jd_VCgq7sN-Hqo_pBHOvEEP9DgMobPt0aDoY3D68vqye8qg_Vl1oU_5OA3x9Aw%3D%3D',
  // ascension to heaven - /AZURE - 7/10 - Pattern
  'dfl_pcq9CsIwGEbhWynvHNC6WLIZ8QaqIriUNE1tMCYl_eoPxnuXtpPgIHiWZznz4gkyZDU4ZKe064x3Cfmk0fKqHRhOwVTgyO6LNO4yfhi7lf9Z_qb4rvhUTIpRISbjOuVxG3PlL63VpItWEungGBgqU9dG9ZYe4EsGa9wZHGCQPTU-gGO2Ou7zzbDqTgXTkvFuWF5v',
  // Racing into the Night - Lysine - 9/10 - Music
  'dfl_1VjdbpswFH6VypVyZVUYbAJEXLRJWk2qdtFW2mUVE5JapWYCp0u17EH2EnuoPUkFhMQxNqRZU3VchHPwOef7zucfUKz7n0AwkcQgADeTiPH5CeMiPREP8clXNn8QAIJ5xqYgAMjuL5G3ukN2Pzh7t-vbIVE__uGi7xTzf-FTo_MGCgfTottUKjtyVbobTjWA7y0L3atqN-p-EVQyZOTG706w_GvCeeN8Ur3mDVfy29B1Q1Sx1ADauOlWBd2NNjGgKtx-6-SQqLobXT81tKqiIp4qpSlGlY6adZD2FG2gtzZF20RoTnrbfjzmmamwaehAVedoHHY3qMqvMo5HYNN_K8SxZ-KjMD4N9mqIgtVttMhF-nQv4qWAy7CP4UtowWmcRxn7LljKQ1h8KIVkiXunyMaDO9I7Jd6Aa64qYIjKgMq5rW43sKgf_v39B2apmJR1rWAXGiH747BXN0-LnEUwSrnI0uSa8TgPI6vKoLa7tvLqlj3z3inGg2frzOVj6m6dkWQPJfuCkq1zLjtXkn1J5LKSM5LsIZHLYrms5FxJ9iWWy0rOSLKHuJQqstc9I58ozZpuRRZWldorC9UCE_tNaeggjshuI1lGOHVhxxTRaFRdEnWg28axjPC66NhOVw2bdNbwmjSL53WD5tpOp1zY6pILo84ataCOfWYggvVNlkO1hpsFpPZJHGMywVoJyiEzJOmEdM2QrhnSNUP2G9tEhezrdS6H9Bu6HDIT7WN1LsaudmtdrE8jfk6042P94wtcp2F9WuNxyaqxQjaHr1qfbnhRAzHD882Ruj1PG5l6cr72MCuGPP1mK4fMM-fhrmn3fGOyb4b0zZB-J6RvhkSWGRNZZlBkdaIiqwUWtcCiFtj6ffC51jiqX0KfcpEjVB9Tu2d-NeZ2zqPtatKhyCbRYxjM0izOi3_jYJQuuAgJzOJ5zL9wEWfPkyR0LJiLSSYuF0kSWgCCKZvNWLRIxAsIfAgSxh9BAAAEk4V4SDMQgOuXnPG4CN1-RRYhv14B',
  // The Hidden Season - Lysine - 5/10 - Music
  'dfl_3ZXfj6IwEMf_laYmPhhiqIISiA-eWfcednPJyvtGCh7NSmugnprz_vdLfwAFy-29XXLGhJnvzLTTj1N0339CTvgxgyGM8wx8JWmaUbDL9hWj0IHfS5LCEKLldXmP0TK8yE8iv419SXpK0oYGjIuZnHSiiSXrvkHhfXd_K84VwQ5mlJfs-EJoVq2wOx6hmRclM1dbJ_0sf7jTBd2MFuOR50XS-eK39tqwn0eGszWdJ8PeiIAfRHimt_SaLesdqUrwHnrqJSx1AhpKCIZWUGHkDi2g4-iT-vnQEXTc-yTuD-3v8HKPP1ZiYpQSo6Ws-Uejo5rYINmDcnbqoaZJ_rzmRI1HCxSJqZoHkcGw9k6GbUyYkMwpM_11z5fTZgrbvvDU8zd6JCVb2WAg8NZ9xIGy-5Q13D5TG852MYFKL9aKu9assen-uuiEaOB7RNjHOIDShtOG1IrVitaG9wGxFjRmfRj_6nV7jY1yP4io5dMtqJF2sPbQ2vAOIrZgblCjmUU9WTSN3O9GGuqeXV8P6M9ep2cDoW42xOeKs8JJswqX5MQJo6vJW37jeQEKUhV7jnN5SSdgy_C5AowCnmfgRDjOHfFHtPKv-rUWqxdxMk2mie2Cq63eCWZU3purvDNI2jdpu9I2epHqGkxU6QSIWlDdioQdZapoYNwZB3MU_jgGf3Wr5Caq4QWKXtNXMQbfDgepl4zvmyZd9Qq2HnH-3xxRVkAHpuRwIPh85DcY-g48EvoBQwgduD_znJUwhC-3itBMpLZHFSm_fgM%3D',
  // That's Why I Gave Up on Music Grid - Lysine - 9/10 - Music
  'dfl_tZRRT8IwEMe_ylISfGlmO7o5RvaAqMREXxTDo1m3IY3Qkq4TiPjdzaCDAlFqgpes97_l17tbbxt6_QSKqUkOIjAYJ-qicIbjpXPv9JOP3HmZOYI7j2XBUqcvWQYgeKtcBLC_wN5qgP3Idd2hWy3r1R3um7tvczqvjerLjI-Mbt0Gp9ubtF5prY0Nu9yU0v0da1v1MIrqnrrd1XOWSAUXMYLLGENeTmkuYw8KyXKuEsUEjzMx55HGsInhHzHPLlvLLhuxy-bbYYFd0Ss7LLQr2rY8XtsxYEvOchC4ZcmdGkVaFkpMX1W-qOeLYJYXqWSzNQSrjyhGC9RsYI90BqjZ8MPOJuhhI3jeuCdYpYrxpQel0IXQQZXwXFVav1Vp_0-V1dO0-sfAVHAlxeSB8byIU52SekSrmfbygzcbhHQOHHIDfhPsdM_Q1_5Odw3dN_SdoW8NfbPVhPf89SOlnu5NN3aiL3Jm5fFNFy3dBQnRcSMVQI6O8AAINYCDHwB8PIVDAv_pLIIzK8IBBBkbjVhaTtQSRG0IJoy_gwgACJJSjYUEEXhYFoznFbp7eSvk6xs%3D',
  // Rotated pathway - /AZURE - 4/10 - Logic
  'dfl_pVBtS8MwEP4rcoN9CmhlhZDRD274B7rJwC8labP1MCYlvZoW63-XtEXBD6Ls4F6fh-eOuyvegZCMBgG5I0m6umkk1UEOwODisQIBvOfjkQsVlFJhp2KMHpYixl2sInaaBqefePRxn4jxMOZK2qKRRNpbtuQs7dP1KrnfbI_pepXyrf2yEEL47uzM2icTa24Oc8rF_4SVsvaPwqWzVpdUSGNY6YzzmcFLTeJ1aEn7gbXOdITOZrznyzY-6Vz7sl-OYm_YojI6S4BBheczlp2hAcSGgUH7AgKAgeyodh4E3D48P-WPkarb0mMTz42Uj08%3D',
  // wacky clued - /AZURE - 4/10 - Underclued
  'dfl_RY_NasNADIRfpSiQ00LrEuOi4EMS-gJOeunFbHY3jvCiDZs1yo_77sU_tIOY0Yjvorf6CYmSd4Ag2rT3F-M7Z0FBE8kCQnEr-kOBInIU2cp2ztnHYRFmGbdBk_e7DPt9X5nA7EyqtffKBB9i6ak5J4yuocC1jk7Pd6tjq670cGWGR831RafkIqs5y_yWLxfZ-2p9yJeL_GPNf5JB_3WidtlITWU_RYUdWxfHFxUosHQ6kel8ugOuFHjiFhBAge7SOURAeN18f1WfA-quJtIlUeAB-fkF',
  // Hi! - /AZURE - 4/10 - Logic
  'dfl_jdJfa8IwEADwz7J7PpjpH5VAHsYY7NltCHuRpo01mCYlTWnLuu8-qnRWrdqHkMvdDxLuMtv8gJNOCaDwLp8AIbUyAQqE1Iv2kxDKebXmFV9zzg_bYVXDsAP8H1QHXw1DXh1DzttXQtsPZVxZYM1m2DAfjZVCu8hJo5kSW0f7MrmuW5nuTiC8qpc51WXGhcWaedgwD49H5p3ng1M-iazDmvnYsFmfDUcuHTjSu7HHDZw30fm9m993p1ffd-FEN-9dcNsthn0Jroc1YGQa86Yxf3wYlywY7_ElC6ex-WO2PPtWtxu3fDCwdlU0GTeq2OTCbqxIpdEYm1I7RjA2yliWRHaPscnyyMrCaJYKQEjkdivjUrkGaICgpN4DBUCISrczFig8v3x_rd46KorYyry7syO_fw%3D%3D',
  // The start of balance - romain22222 - 2/10 - Logic
  'dfl_ZY_BagMhGIRfReYsSxK6lx9y0L5BG8gxqOvGnxgNrost2bx78dJL5jvMwMxldpcnKtfoQTgFL5ZqShV5FtZEk5yHxLXwBML487GdRjpbe9a2Wds63VvbPkcalBoGpZXSne5ab9_bl_MxXlxeU5Uux1yOka-h5zXV435Hb_1kyu2_hsTE88xujfUXdJCInG4gQMKsNeQCQsl3w-nQ1fd-cYUflXMCQYkl5ObM4vspIybvH-LuXTCJHV5_',
  // We are not the same - romain22222 - 8/10 - Logic
  'dfl_RZDdSsNAEIVfJYzgRVmKWoWwkhuLL6CBXobZzdQu3Z8wmTCK8d1lq9C5-M7N4eMwd8M3SJBIYOFADTI1uUgjJ2pmTAQGPjiMYKH93K19a1UPzjmn-gd9caoV6_7eru_rm19mKcmMNHsOk4SSu32JS8pz4zFX9YZpIpSNqeKuf7y9eWqfr05X6azDPEwoQpzNf3b97tLd6lZVrS85k5cBYzS-xMLdiHwGA2M4HoNfonyBbQ3EkM9gAQzgIqfCYIFLwpAf6tX-dStYeE2O0dPlA9VETNnTDD-_',
  // Polyomino's - hallojasper - 7/10 - Logic
  'dfl_fZBBbsIwEEXvMkh0M4vEhFIZecUFKmAf2YkhBmOnE0chbXr3yoRIVCqVxvM9X09_ZCf5FwQTrAYO7972_mKcf2kA4UimBA6r6-uwX_FOqW48sVSnlLq1aYr-7a6GTcqHXSkp4FUssRcMXXtRmkSCnox2QQbjnWhr_gAt_oZK37kJy7AXywlLn2Qx7EUyQewXROZYhYlLHsMWz7mYl_2TN2wL75wuQi6txcJbT6KUdOakj8a7XJKWd9tGHhvzqUXGlXR5LUPQ5PCugl3ZfJaybL1n89nybR3_eDQ26c0Yh90oW94689HqvKlkrR93AEJpDgdTtDb0wFcI1rgzcAAE2YbKE3CopLX-JJtaU-R1U5Cp47si9_0D',
  // Galaxies - mincho - 6/10 - Logic
  'dfl_fc8xa8MwEAXg__LmG-wYp_HBLe3Qve0eVFtxjihSkWWwWve_BxNCKTh5072Pt1yx_0HS5CwYr8aZSe0AQh-1A6OZmvmjYf84z_ePO5lfSp7f_Xj-tJEmKSjLhq5VKv7n2xUvKctuxZ8eeLniO8pS3Lzmfvk_0yQVZan-ak1Z6vkt2l6D35toDbXBhSidiSca9NtKBUKnh4O2o0sZvCU49ScwQDBjOoYIxll9ewzL1A5t1K-kwS-T3ws%3D',
  // Snake - hallojasper - 4/10 - Logic
  'dfl_fY3BqsIwEEX_5QqugjhaQSJu9A-s4LIkadTYMCkxQsX676Itj7covZvLHC5n5sULySVvIZGzqiwELtGVkCBqiNojkeS_7HgspwG0G4Kjln8_2j3JNm8PJjBbkwrlvTDBh7gtVaykVlzUKiUbWfS9XTaL6YQW2ea4nE5W643Ws5nWHdrTD3VH3tVh0JI11Fuy3jLqgEDpzmdnHj49ITMB77iCBATUI11DhMRVeR9u6l7b-N3bu4muTi7wd_f-AA%3D%3D',
  // Abusing the limits - romain22222 - 3/10 - Logic
  'dfl_rY7LTsMwEEV_pZq1VdlJqsJIXhT-AJBYIrd10lEdu3ImkIjw7yiQV9nAgju7c-baI1_egYmdBYTdvq7IFys-2ZWjkrgCAUWkIyAo2SjZPSmJfj3NnF_Z85_27gbU3SuJuynraf6bdY-vZN8ugTyLRkvRail8Xe5t1AqXKhGtVqPa4s_WzaiSK7VdtlJ0getKNDr7wiGS9WyYgtfO5oyFcaZpB7_B79rw9-181sQ3VzybhRKtTkex4P272XSp6h5AwJHynA614xYwFeDInwEBBJiaTyECQgylIZ_06fdtdYh06a_u9z4-AQ%3D%3D',
  // another view - /AZURE - 5/10 - Logic
  'dfl_rY_RSsMwFIZfRc5gVwds2maOjFzI8AW6ieDNSNrMhcWkxNQ2WN9dauec0Itd-MPh5PD9_yEn2X1A0MEoYCCsCwflb961agHhxesKGJCkI0m_JQl7-pU96b9eZ_VrwvrN8IPaaRuw4wQjX6JtXqXyPGOXKMfI734Q_YMyjHwxnUoxcjqdohh5Pp1aYOTZdGpA6Rn1hRR2V4sQlLd46px2dD4jab7a0vmMLlfj4XIoKe2FRteafLvGYTO2gl2_uB1KttcuLp21qgw7YQyWzjjPK-GPgFDp_V6XjQkRGEUw2h6BASCIJhycBwa398-PxcNgVW-l13XQzg6Wzy8%3D',
  // One of each - hallojasper - 6/10 - Logic
  'dfl_bZHBjpswEIZfBTlSDquphBPCskY-ZPcBVkr20Bsy4CTuGoyMKVhN372yTZKlrSWjmd_fMP9o4uIXMsJIjgh6b3mkThFn1QUBOmtRI4JwPOH4-oFjUpblOIbrvuN8Z3H0-hKY4xm4P_ybhDOO5fUNk-uxHZqSa5goBks3EFL6TBY6fuiNVZ1gMNEtWBpDLTSvjFBtTyWRygw9TPQFLH0BpQVvDXOPdOjujxlYmv31-E3ykyE10wYmmoKl6a3hdkFqcb4YcmaSTRYmunEk-Sn42CnRutpnsHR7q02I5Mb4ITI_REjpfqmnN_31euhZw4v-wjoOlZJKU-k79rYpleyLjutC87NQLVRqaA3FC6waeqMaqHlfadF5x3sTNao3EY7CP6KO66hm-jNimjNwi6e7KVmv8CbJP3br1S7Lx7DhsPCw7jEAb9gDITmGdoXhk1mvkiSf1qsU59jH9kv8xY9X99FTKH2KXO3szKPOj2e8p22W3325eJfl7X_OA3T-ZvAhHh_hwTcJhlOcf_epVmG7XorDbAcEqBank6gGaSwiKSAp2k9EEALEBnNRGhF0YVKqH6zvuHb8Y0zH_f4D',
  // Front page - /AZURE - 2/10 - Logic
  'dfl_jYzRSgMxEEV_RW6hTyG2xYCk9CFb9AO2FcGXJZum22CYLHHKVlz_XeIqiE8dmHuZ4XAWzQc4cPTQeMyJ-Ka3nYdAl8MBGuqixr3Skv5NRc_lJ8et0lIaY6Q0VVVi3I11a6npLbPPJH56oy5qPluu7tZ7NZ-p-_XkGcoOw1_1RG2X39R07Kaq9fXitv2Nq8QuEXnHjY1RuBRT3sTQnRgCh3A8BneO_A69EoiBXqEBAXvmU8rQuDUvT_VDQf2by6HnkKggn18%3D',
  // a short sticky situation - /AZURE - 5/10 - Logic
  'dfl_jZDNTsMwEIRfJZrzqsSkFbCSDwjxAi1cuEQmdZNVXbuyHamG8O6Iv5QTYk-z38xcpm5fkSU7C4apqjSEmKuUpduXKkkeTZbgQeijbMFQ9el6elA1--9b-H-qxd9qulM8bfx4eLaRTvqKiq7p69WKZ95Q0eqHN2e-oqKXc_7ybNxQ0c1cmNbJHGybBnO01AUXonbSD5mj7SX41kRrfnNK8mJ1A8JWdjvpRpcLeEVw4vdggGDGPIQIxsXt0-P6_iNqUxfl-DkcA2_v',
  // i hate sweeping - /AZURE - 3/10 - Underclued
  'dfl_bczNCsIwEATgV5E5B7StvSz0IOILVCXgRWy76mKNJU2IYn13qaD4N9dvZkbrK5y4mkGQwX7jeNAG5kbMDgo7KxUI6XncLVIKIRQhaK1N0IU2RZ9uGlE3P4rhx4ytOmeRumSRMv5YsM0i-sT4HWP6XcZPHH9h8o7pH3zdJl3uTcW2rD1XCgqVbLdS-tpdQIlCLeYAAhQ23u1PFoThZLXMZ32V29JK4-Rk-srtDg%3D%3D',
  // Surrounded - Lysine - 6/10 - Underclued
  'dfl_bZDBasMwEET_Zc97sN00DgIdSq89NQEdQ2UrragyLoqEIur-e5ECcUMz7B7mzSwCNftvCjY4Q4K20fspYjQjMb17O5Kgtjm3zbxrGwEAqQjQZbVG0kpppKR0QrHQQAKgoRWqVHX_VGNV5yadn1sxb50JwXg-y46z7Phi5ZO48p6z7BeOeNSVt7V_sbJrlqD_G2wWvuYsV9eDhT9wlo93eHlgc4evbvj8Wj7RDy6akYlptIeDHaILmcSayVl8kiBieovhY_Ik6CWfLEypmtPg7VewE0rl5xc%3D',
  // Spiking trail - /AZURE - 10/10 - Logic
  'dfl_lYzBasNADER_pSiQ00Jj04JRyKEb-gN2iqAXs107jvCiNVsFEuL8e3DdNtdWIN7MMMyqvoCyhhYQqoF7lu5Bk-MABrrEDSAUp2LcFSi_R0IT7PQkdzMrIXsv_kgrNG4zHKux_HBSD061TWK-uclP-XKR5U_rXb5cPBdra62dg232FcymmlGijyKt19qFYHwMMW0al3r8yzQR0f-mA3cHBQMN7_fsj0HPgNnKQGDpAQEMuKMeYgKEx5f3t_J16rafPvGgHGWqXG8%3D',
  // Pentomino's - hallojasper - 9/10 - Logic
  'dfl_TY_dbsMgDIXfxZW6G4QWtEobVS8gLzC1vY8gpQ0tg4wQpduyd5_46VrLwubz8UE8Nz8QdDAKKLwrG9yHtu5pAAQnrw9AoSLXisz7ilCZYpJymiaZMh4y9fdIXOLISmblTZgz6crCJLPlv--DV_Er29P9DSnlXFeEYswY5xgzjjFmmGPGMOMs9RGVOYu8kDIp47SQa2x4LCWyJb7JkiA5Y15nhlnNeZ1g7Bmbd_O2ddaqNjTCGNQ64_zmIPyFenXSzjbCK1Gw0acuoEF_q82KSmGbXoSgvEWlbsiVLBcVeVnvyXKxel3Hv2dQVwnkyy6XLR2t_hxVM3SiV49vAIKDPh51O5rwBfQNgdH2AhQAgRhD5zxQ6IQx7iyGXvmoV0PrdR-0s1H3-wc%3D',
  // Matrix - Lysine - 6/10 - Pattern
  'dfl_NcoxC8IwFATg_3JzCLoIzfhcdVHhRmlr1Ie1LemTKNb_LhG86e74Fsc3TK2LCNjWlvQJh0vSEwKqZzUfqkARiogXIUv3v02hJ8lM0lMoOYv8HmlywUXkxtP_wyyNkN7P62WY9_OuHe5jFy0ex9ospt7B4aTns7aPzl4IK4dO-xsC4FA_7DokBGxek_ax0Di1SUfToS_k8wU%3D',
  // Chain reaction - /AZURE - 5/10 - Logic
  'dfl_rZFBbsIwEEWvUn0kVqPWhpiAkRco6gUC3XSDQjDFajDIdUSipnevIJAEKUtmMzNPX28xw9a_8MZnGhLRPjH2xekk9eZoQfhyZgsJzgrOqhVn8tXeqhmeVa25irisljY_bLSjQoVUqhnVqxrLhgddPm05o1KFdz555KM7D1rOqVSsx3Pxj3t42PWIls-6-eAxP2k8VbxJ7PqUeK-dpVtXohDDAR8F85UYDsR03nuh89naOhXxa6pelnWLQdia3c6keeZLSEHIjP2GBAhJ7vdHB4m3xedH_H6J6p_UmdP1zxL4-wc%3D',
  // Witnessing every vertex - /AZURE - 6/10 - Logic
  'dfl_nVFRa8JADP4rJYJPR7db1zFOfLCyP1Adhb2U6_XUwyNXrtFW1v330VZEYTC3hCQk38eXQB7zTyBDVoOAzBDquja4DfRR-1Nw1J50Cwy23pQggEctj7o1j0R4bQleLAlDzC4ehsMwG_JPCP4D-U0tubmtW3LRrbpUOUStKJfWMuWs8_NS-r0oJOaVJNIe2bnO4zaeTvjT82wdTyfx6-ysW_RRFFebRtaSD6yxWY0l_YNw00fT4H3CwKA0m41RB0snEC8MrME9CAAG8kA750HAw-LjPX3rqbpW3lRkHIKARVBJ2gXkbt_79Q0%3D',
  // Essentially hexagonal - Lysine - 8/10 - Logic
  'dfl_7ZVNT4MwGMe_iqmJp6bhRXCp4VBAvXhS7wtsdTbWskCXjTi_uykMN3lpe9jBgyQ8Dfx_z3sCzvwTSCY5BRjcVRUVkmWc1xdvdJetCpFxAMGqZEuAgR_sfG__4gcYISQMlxWibBxPW2SD6PVDEBNylnbOVMuZ5vK_o1Hkf0d_f0f7xA_VR4aQONbdyI6J4yRJ0-kb2TGEpKm5GiOjMumyIUvmXPWYeifEltHuQjVkyehyqYZM9RwYXe9pap7PgdHtghDzvjrGkKsdoQ2j6b0doi0zuYsOs2SmO-8wM6PpvcN08zlhpnbRYbp9dcz-mVMpaQl3kYMCWEchCmD7KiL4R_PcRnRGxbDvGB8112tEdzaqejf9sMlAbCIMVd_vu6YDV-96VG2K-V3THe6NwXdGxXDg-TAo6TTr_WASp4Hv-4FPxYf9U1V_5AWv5mtazku6YoWAi2IjZOTARcGLMlpm5TvOMzFfZ8pHwMMZhTvv6tL1rm9fwqvLYHa73eb5dtvaVkjcRmgfntvjaSJW2Iulfl6tFXl-tOKoaHIACJbs9ZUtNlzWAM8g4Ey8AwwABNlGvhUlwOCxrpigCqXVomRryQqhkK9v',
  // Shifting Dance - Lysine - 4/10 - Music
  'dfl_1ZbPj6IwFMf_laYmHAyZiCJrIB6Aceaws5fVDccJv9RmsLilLJp1__dNXxEK4lw2HrYm9L1vqX39vFdg8v4bc8KzFNt4vSdbTugOPYc0TrGOd4wk2MaGdbIuG8OyAy8IgiiqqqqCixd4gVfJJuQgCLxAmtAC0aqquaPrK-P1jItvWPaTaK7rea4LHfjC8zzo_nX8sr58P5QFifU4p5zl2RuhabGMJ9rImJpONDVr6yg79mvyZFF_ro1M0wHbM1vbVexXxX5R7JWpcxbGH0sBUv7pxrC00XzhAEeFaAS_lmitN0S77Y6sDMnV_Hq1R6OVq61lJyEDBRW0NrIMR8CeLRwF-NU7tiZrAAulgTzqCS99YdXzn3u-P5K5gZxAOIZ1-tKuC7kRjsjPDddH5-saha9E8ei89cfbKNatec1njbKbUyEqeb3NbS-_3RyLw3VV1UPW19wB7XVAexnQVgOaUhl1MdT7mJ_MbpwbJcL5wqEDrTvBNzoTuoPrrquSvUt3gHBD2ZgOqMcB7Rb3PeT3sH-CXkFYB2vHZcHzg56kRczIkZOcLsdf0zOK9yHdpfBMGiM3yxDNeVqgkKWoEC-hNEEhRenPMsxQeMhLynXxLlrORF4gH7P6gRZFonbFVWu4A2_gLNd_J3FO4cif4LhPwD6DPQVbCRBUF43l1DESc1FxPkR5BreKOLROjaj18WltqHXR1ET_lMEiMmDLcL4lLmN59eNYhSyBIZbzsIlzApsd3uVU2aXxv-8SJmEdJ2S7JXGZ8TO2TR1nhH5gG2MdhyXf5wzb-O1cECo-XpTdilv-_AU%3D',
  // River Flows Beneath You - Lysine - 7/10 - Music
  'dfl_7VfbbuIwEP2VyJF4QFGVK4sS8ZAb1UrtSgu89KlKglssQlzlUkDL_vvKdkqMgVCKVtuucFV5ZjzHZ0axZ4z6-AuUqEwhsMEIvcJcGqZ4WUgezGBUzqQHXAEFPOdoCmxg6CvN2EwM3V7WI46XB0cc764c82sf-6j37SN6XcJ-DvYw4vx9PjZ4no1v6Lbruq7ntf23r17xfxe_GW9Gi6pAiZLgrMxxeocyWAwStSNruunEeq-WXjQ256_qTS8bymZHNk2HKiEnB5zs806e0cguJ9_KnDLklZCTA4PfllM8ndtWV8o8SuYDQ1_pFgt3Yugd2eo7Rw_sifN8cjkWPPk5bgwx_dufjyB3uN9_bfegZ-9w0Yi5ZI-5XIv1ScS_KNbstvj1bblpGaRutK2TqnLFX4Zvq9q-73ntVd_3P3vX-ep4dlvGbGL9k7Yhvod25J7mkD5q9B2ul75ppJ--yaynhj1m2fY8QfdlweBZu7or6LeyYBiKhlDQA0ukFAyeKVCaIoNgCAU9MEUGwUDeCTsMhpiUIVIKhlDQA0OkFAzkDbFDyd4U9C1Bv6KdVEWJF8oUFkmOXkqEs0E3QAXxIEpBi2ZX-v6c4RxKVZbDKJlFcQqlDJewUMhvl4G-0us3SVNk67KrUUN9qhjZI0pwRuNY0RhUKq85mYuGWl2py6BdiWClYr2IcUpdCT_1sVZmc-wm9ce1-k52YDSOvrZ1bIzjRhxREhZwT3Pupz8rWJC47qN8TtdyXEbbQFWa7eE0NS5N7f9NU_1Kad6T-vYDl_Djn_LTn9j2HCkEKGCKnp5QUqXlGtjfFJCibA5sABQQVeUM58AGd-sCZZC4NrkSl99_AA%3D%3D',
  // Crossection - /AZURE - 4/10 - Pattern
  'dfl_rZDRasMwDEX_5Rb6ZNi8dRBc-jCH_kDaEdhLqVJ3M3XjYDvzwrJ_H46zQd8nI650EdLB94cvBB2MgkDprPeqCdq2YHhz-gSB4pM_jvtCxNugX6mnkDJLLbP8uXJ2ZT2X2ZUyUn40L6NUU6Sx5GLcjVVjr51RQR26YwjKtUxcBx-UG5i3pk-Mm4S2XPCH1XpfLBdPxfqW7X8YKeacNiXAGCkfLfl0NDe7LBX70F6TURsOhpM-n3XTmzBArBiMbi8QAMOxD-_WQeDu-fWl2qZR5Runu-nvBfD9Aw%3D%3D',
];

const curatedPuzzles: { link: string; puzzle: Puzzle }[] = [];

export interface CuratedPuzzlesProps {
  filter?: string;
}

// eslint-disable-next-line react/prop-types
export default memo(function CuratedPuzzles({ filter }: CuratedPuzzlesProps) {
  filter = filter ?? 'All';
  const [puzzles, setPuzzles] = useState<typeof curatedPuzzles>(curatedPuzzles);
  useEffect(() => {
    void (async () => {
      while (serialized.length > 0) {
        const data = serialized.pop();
        if (!data) break;
        const decompresed = await Compressor.decompress(
          decodeURIComponent(data)
        );
        const puzzle = Serializer.parsePuzzle(decompresed);
        curatedPuzzles.push({ puzzle, link: data });
        setPuzzles([
          ...curatedPuzzles.sort(
            (a, b) => a.puzzle.difficulty - b.puzzle.difficulty
          ),
        ]);
      }
    })();
  }, []);
  const filteredPuzzles = useMemo(() => {
    return puzzles.filter(({ puzzle }) =>
      filter === 'All' ? true : getPuzzleType(puzzle.grid) === filter
    );
  }, [puzzles, filter]);
  return filteredPuzzles.map(({ puzzle, link }) => (
    <PuzzleCard
      className="min-w-64 transition-all hover:scale-105 hover:rotate-3 hover:shadow-xl"
      key={puzzle.title}
      grid={puzzle.grid}
      metadata={puzzle}
      link={'/solve?d=' + link}
    />
  ));
});
